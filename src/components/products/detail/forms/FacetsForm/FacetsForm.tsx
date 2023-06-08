import React, { useEffect } from 'react';
import { Control, FieldValues, UseFormTrigger, useWatch } from 'react-hook-form';
import { Box, Card, CardBody, Flex, Grid, Text } from '@chakra-ui/react';
import { IProductFacet } from 'types/ordercloud/IProductFacet';
import FacetCheckboxControl from '@/components/react-hook-form/form-checkbox/facet-checkbox-control';

interface FacetOptionsProps {
  facet: IProductFacet;
  control: Control<FieldValues, any>;
  trigger: UseFormTrigger<any>;
  productFacets?: any;
  index?: number;
}

const FacetOptions = ({ facet, control, trigger, productFacets, index }: FacetOptionsProps) => {
  const watchFields = useWatch({ control, name: `Facets[${index}].Options` });

  useEffect(() => {
    trigger(`Facets[${index}].Options`);
  }, [watchFields, trigger, index]);

  const formattedOptions = facet.xp?.Options || [];

  return (
    <Box>
      <Flex flexWrap="wrap" gap={4}>
        {formattedOptions.map((facetOption, i) => {
          return (
            <FacetCheckboxControl
              key={facetOption}
              name={`Facets.${index}.Options.${i}.value`}
              control={control}
              label={facetOption}
              productFacets={productFacets}
            />
          );
        })}
      </Flex>
    </Box>
  );
};

interface FacetTableProps {
  control: Control<FieldValues, any>;
  trigger: UseFormTrigger<any>;
  facetList: IProductFacet[];
  productFacets?: any;
}

const FacetTable = ({ control, trigger, facetList, productFacets }: FacetTableProps) => {
  return (
    <Card>
      <CardBody gap={4}>
        <Grid gap={4}>
          {facetList.map((facet, index) => (
            <div key={facet.ID}>
              <Text as="h3" fontWeight="bold">{facet.Name}</Text>
              <FacetOptions facet={facet} control={control} trigger={trigger} productFacets={productFacets} index={index} />
            </div>
          ))}
        </Grid>
      </CardBody>
    </Card>
  );
};

interface FacetFormProps {
  control: Control<FieldValues, any>;
  trigger: UseFormTrigger<any>;
  facetList: IProductFacet[];
  productFacets?: any;
}

export function FacetsForm({ control, trigger, facetList, productFacets }: FacetFormProps) {
  return (
    <>
      <FacetTable control={control} trigger={trigger} facetList={facetList} productFacets={productFacets} />
    </>
  );
}
